// imports
import express from 'express';
import type { Request, Response } from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';

// db imports
import { db } from './db/db_connection.js';
import { stocks_available, wallet_ownership, created_wallets } from './db/schemas/schema.js';
import { eq, and, sql, gt } from 'drizzle-orm';

// helper inports
import { nav_buttons } from "./helper_ts/variables.js"
import { getPageTitle } from "./helper_ts/functions.js"

// variables
const app = express();
const PORT = 3000;

// get the __src_path and __static_path
const __filename: string = fileURLToPath(import.meta.url);
const __src_path: string = path.dirname(__filename);
const __static_path: string = path.join(__src_path, '..', 'static')
const __app_path: string = path.join(__src_path, '..')

// use json
app.use(express.json());

// Support URL-encoded bodies (for standard HTML form submits)
app.use(express.urlencoded({ extended: true }));

// favicon
app.use(favicon(path.join(__static_path, 'favicon.ico')));

// static files
app.use(express.static(__static_path, { maxAge: '1y' }))

// bootstrap files
app.use('/bootstrap', express.static(path.join(__app_path, 'node_modules/bootstrap/dist')));
app.use('/bootstrap-icons', express.static(path.join(__app_path, 'node_modules/bootstrap-icons/font')));

// handlebars setup
app.engine("hbs", engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__app_path, 'views/layouts'),
}))
app.set('view engine', 'hbs');

// handle routes for front-end
// 
// default
app.get('/', (req: Request, res: Response) => {
    res.render("start.hbs", {
        nav_buttons: nav_buttons,
        title: getPageTitle(req.path)
    })
});

// sell / buy form - front-end
app.get("/sell_buy", (req: Request, res: Response) => {
    res.render("sell_buy.hbs", {
        nav_buttons: nav_buttons,
        title: getPageTitle(req.path)
    })
})

// GET /stocks - front-end
app.get("/get_stocks", (req: Request, res: Response) => {
    res.render("get_stocks.hbs", {
        nav_buttons: nav_buttons,
        title: getPageTitle(req.path)
    })
})

// post_stocks form - front-end
app.get("/post_stocks", (req: Request, res: Response) => {
    res.render("post_stocks.hbs", {
        nav_buttons: nav_buttons,
        title: getPageTitle(req.path)
    })
})

// get_wallet - front-end
app.get("/get_wallet", (req: Request, res: Response) => {
    res.render("get_wallet.hbs", {
        nav_buttons: nav_buttons,
        title: getPageTitle(req.path)
    })
})

// pure backend routes - requirements from file
// 
// "simulates sell or buy of a single stock"
app.post('/wallets/:wallet_id/stocks/:stock_name', async (req: Request, res: Response) => {

    // take action from body
    const action: string = req.body.type

    // take wallet id from url
    const { wallet_id, stock_name } = req.params;

    // check if user entered a wallet id (it needs to be a digit)
    if (typeof wallet_id !== 'string' || !/^\d+$/.test(wallet_id)) {
        return res.status(400).json({
            message: "Invalid Wallet ID"
        });
    }

    // check if user entered a string stock_name
    if (typeof stock_name !== 'string') {
        return res.status(400).json({
            message: "Provided stock_name is not a string"
        })
    }

    // check if stock_name exists
    const stock_result = await db.select()
        .from(stocks_available)
        .where(eq(stocks_available.stock_name, stock_name))
        .limit(1); // apparently this is an optimization - stop looking after finding one

    // stock non existent
    if (stock_result.length === 0 || stock_result[0] === undefined) {
        return res.status(404).json({
            message: "The stock does not exist"
        })
    }

    // extract object
    const stock_selected = stock_result[0]

    // change the wallet id to number
    const number_wallet_id: number = Number(wallet_id)

    // check if wallet exists in db
    const wallet_exists = await db.select({
        wallet_id: created_wallets.wallet_id
    })
        .from(created_wallets)
        .where(eq(created_wallets.wallet_id, number_wallet_id))
        .limit(1)

    // if wallet does not exist - create it 
    if (wallet_exists.length === 0) {
        try {
            // try to create a new wallet
            await db.insert(created_wallets).values({
                wallet_id: number_wallet_id
            });
        }
        catch (e) {
            return res.status(500).json({
                message: "An error occured while creating/inserting a new wallet",
                error: e
            })
        }
    }

    // check the type - buy
    if (action == "buy") {
        // check if we can buy the stock
        if (stock_selected.stock_amount <= 0) {
            return res.status(400).json({
                message: "There is no stock '" + stock_name + "' in bank"
            })
        }

        // check if record present in wallet_ownership
        const wallet_ownership_result = await db.select()
            .from(wallet_ownership)
            .where(
                and(
                    eq(wallet_ownership.wallet_id, number_wallet_id),
                    eq(wallet_ownership.stock_id, Number(stock_selected.stock_id))
                ))
            .limit(1)

        // check if wallet_ownership record exists
        if (wallet_ownership_result.length === 0 || wallet_ownership_result[0] === undefined) {
            try {
                // wallet_ownership record non existent - try to add a new one with 1 as stock_amount
                await db.insert(wallet_ownership).values({
                    wallet_id: number_wallet_id,
                    stock_id: stock_selected.stock_id,
                    stock_amount: 1
                })
            }
            catch (e) {
                return res.status(500).json({
                    message: "An error occured while creating/inserting a new wallet entry to wallet_ownership",
                    error: e
                })
            }
        }
        else {
            // // extract object
            // const wallet_ownership_selected = wallet_ownership_result[0]

            try {
                // wallet_ownership record exists, try to add +1 to its stock_amount
                await db.update(wallet_ownership)
                    .set({ stock_amount: sql`${wallet_ownership.stock_amount} + 1` })
                    // .set({ stock_amount: wallet_ownership_selected.stock_amount + 1 })
                    .where(and(
                        eq(wallet_ownership.wallet_id, number_wallet_id),
                        eq(wallet_ownership.stock_id, Number(stock_selected.stock_id))
                    ))
            }
            catch (e) {
                return res.status(500).json({
                    message: "An error occured while adding +1 to stock_amount in wallet_ownership",
                    error: e
                })
            }
        }

        try {
            // try to remove 1 stock from bank
            await db.update(stocks_available)
                .set({ stock_amount: sql`${stocks_available.stock_amount} - 1` })
                .where(eq(stocks_available.stock_id, stock_selected.stock_id))
        }
        catch (e) {
            return res.status(500).json({
                message: "An error occured while substracting -1 from stock_amount in stocks_available",
                error: e
            })
        }

        // if we got here, we successfully bought a stock
        return res.status(200).json({
            message: "Wallet " + wallet_id + " successfully bought a stock '" + stock_name + "'"
        });
    }

    // check the type - sell
    if (action == "sell") {
        // check if we can sell the stock
        const wallet_ownership_result = await db.select()
            .from(wallet_ownership)
            .where(
                and(
                    eq(wallet_ownership.wallet_id, number_wallet_id),
                    eq(wallet_ownership.stock_id, Number(stock_selected.stock_id)),
                    gt(wallet_ownership.stock_amount, 0)
                ))
            .limit(1)

        // check if wallet_ownership record exists
        if (wallet_ownership_result.length === 0 || wallet_ownership_result[0] === undefined) {
            // wallet_ownership record non existent - you can not sell a stock that you do not own >:(
            return res.status(400).json({
                message: "You can not sell a stock that you do not own >:("
            })
        }
        else {
            // we know that we can sell the stock because of - gt(wallet_ownership.stock_amount, 0)
            // 
            // extract object
            const wallet_ownership_record = wallet_ownership_result[0]

            try {
                // try to subtract 1 from wallet_ownership
                await db.update(wallet_ownership)
                    .set({ stock_amount: sql`${wallet_ownership.stock_amount} - 1` })
                    .where(and(
                        eq(wallet_ownership.wallet_id, number_wallet_id),
                        eq(wallet_ownership.stock_id, Number(stock_selected.stock_id))
                    ))
            }
            catch (e) {
                return res.status(500).json({
                    message: "An error occured while substracting -1 from stock_amount in wallet_ownership",
                    error: e
                })
            }

            try {
                // try to add 1 to bank
                await db.update(stocks_available)
                    .set({ stock_amount: sql`${stocks_available.stock_amount} + 1` })
                    .where(eq(stocks_available.stock_id, stock_selected.stock_id))
            }
            catch (e) {
                return res.status(500).json({
                    message: "An error occured while adding +1 to stock_amount in stocks_available",
                    error: e
                })
            }
        }

        // if we got here, we successfully sold a stock
        return res.status(200).json({
            message: "Wallet " + wallet_id + " successfully sold a stock '" + stock_name + "'"
        });
    }

    // if this whole "simulates sell or buy of a single stock" fails there are 2 possibilities:
    // a) db is down
    // b) someone actually bought a stock, inserted new values to bank (overriding them)
    // and now tries to add them back to bank - so we SHOULD try to insert a new record to stocks_available
    // BUT we check if stock is present at the beginning... that is why i guess i should skip this case???
    // although if you do as descibed above there can be a wallet with a stock that does not exist in db

    return res.status(400).json({
        message: "Unrecognised operation type: " + action
    });
});

// GET /stocks - return all stocks available in the "Bank"
app.get("/stocks", async (req: Request, res: Response) => {
    // get stocks from database
    const stocks = await db.select({
        name: stocks_available.stock_name,
        quantity: stocks_available.stock_amount
    }).from(stocks_available);

    // create an object
    const js_object = {
        stocks: stocks
    }

    // send the object
    res.status(200).send(js_object)
})

// POST /stocks
app.post("/stocks", async (req: Request, res: Response) => {
    // get all stocks entered
    const stocks = req.body.stocks

    // check if req.body.stocks is present
    if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
        return res.status(400).json({
            error: "Missing Data",
            message: "No stocks were provided in the request or invalid data structure"
        });
    }

    try {
        // try to insert stocks to database        
        await db.transaction(async (tx) => {
            // Clear the table
            await tx.delete(stocks_available);

            // insert new values to table
            await tx.insert(stocks_available).values(stocks);
        });

        // if we reach here, operation was successful
        return res.status(200).json({
            message: "Insertion was successful"
        })

    } catch (e) {
        // if we reach here, operation was not successful
        return res.status(500).json({
            message: "Insertion was NOT successful",
            error: e
        })
    }
})

// GET /wallets/{wallet_id}
app.get('/wallets/:wallet_id', async (req: Request, res: Response) => {
    // take wallet id from url
    const { wallet_id } = req.params;

    // check if user entered a wallet id (it needs to be a digit)
    // we actually check server side and client side if these were provided
    // if we dont check client side we get /wallets/ = bad
    // if we dont check server side - it feels unsafe
    if (typeof wallet_id !== 'string' || !/^\d+$/.test(wallet_id)) {
        return res.status(400).json({
            message: "Invalid Wallet ID"
        });
    }

    try {
        // try to get all records from wallet - we need to do a simple innerjoin,
        // as stock_name are stored in a different table
        const wallet_result = await db
        .select({
            ownership_id: wallet_ownership.ownership_id,
            wallet_id: wallet_ownership.wallet_id,
            stock_amount: wallet_ownership.stock_amount,
            stock_name: stocks_available.stock_name, 
        })
        .from(wallet_ownership)
        .innerJoin(
            stocks_available, 
            eq(wallet_ownership.stock_id, stocks_available.stock_id)
        )
        .where(eq(wallet_ownership.wallet_id, Number(wallet_id)));

        
        // map the results
        const front_end_stocks = wallet_result.map(w => {
            return {
                name: w.stock_name,
                quantity: w.stock_amount
            }
        })

        console.log({
            id: wallet_id,
            stocks: front_end_stocks
        })

        // return wallet data
        return res.status(200).json({
            id: wallet_id,
            stocks: front_end_stocks
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "An error occured while fetching wallet data",
            error: e
        })
    }
})

// GET /wallets/{wallet_id}/stocks/{stock_name}
app.get('/wallets/:wallet_id/stocks/:stock_name', async (req: Request, res: Response) => {
    // take wallet_id and stock_name from url
    const { wallet_id, stock_name } = req.params;

    // check if user entered a wallet id (it needs to be a digit) and stock_name 
    // we actually check server side and client side if these were provided
    // if we dont check client side we get /wallets//stocks/ = bad
    // if we dont check server side - it feels unsafe
    if (typeof wallet_id !== 'string' || !/^\d+$/.test(wallet_id) || typeof stock_name !== 'string') {
        return res.status(400).json({
            message: "Invalid Wallet ID OR stock_name"
        });
    }

    // check if stock_name exists
    const stock_result = await db.select()
        .from(stocks_available)
        .where(eq(stocks_available.stock_name, stock_name))
        .limit(1); // apparently this is an optimization - stop looking after finding one

    // stock non existent
    if (stock_result.length === 0 || stock_result[0] === undefined) {
        return res.status(404).json({
            message: "The stock does not exist"
        })
    }

    // get the stock_name id
    const stock_name_id = stock_result[0].stock_id

    try {
        // try to get the provided stock_name record from wallet_ownership (according to my logic there should always be 1)
        const wallet_result = await db.select()
            .from(wallet_ownership)
            .where(and(
                eq(wallet_ownership.stock_id, stock_name_id),
                eq(wallet_ownership.wallet_id, Number(wallet_id))
            ))

            console.log(wallet_result[0]?.stock_amount)

        // send just the number, not sure if "?." is the tight thing to do here
        return res.status(200).send(wallet_result[0]?.stock_amount)
    }
    catch (e) {
        return res.status(500).json({
            message: "An error occured while fetching single stock value from wallet data",
            error: e
        })
    }
})

// start app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});