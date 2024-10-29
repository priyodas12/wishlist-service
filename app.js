

import cors from 'cors';
import express from 'express';
import mongoose from "mongoose";
import uuid4 from "uuid4";
import { WishItem } from "./model/WishItem.js";

const app = express();
const port = 3000;


app.listen( port, () => console.log( `wishList app listening on port ${ port }!` ) );

app.use(express.json());
app.use(
	cors(),
);

var corsOptions = {
	origin: 'http://localhost:4200',
	optionsSuccessStatus: 200,
};

mongoose.connect( 'mongodb://localhost:27017/wishlist' )
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

app.post( '/api/wishItems',cors(corsOptions), async ( req, res ) =>
{
  
  const { wishId, wishDesc, isCompleted, startDate, completeDate } = req.body;
  
  console.log(
		'Creating new wishItem: ',
		wishId,
		wishDesc,
		isCompleted,
		startDate,
		completeDate,
  );

  const wishItem = new WishItem( {
		wishId,
		wishDesc,
		isCompleted,
		startDate: new Date(startDate),
		completeDate: completeDate ? new Date(completeDate) : null,
  } );
  
  wishItem._id = uuid4();

  try {
    const savedWishItem = await wishItem.save();
    res.status(201).json(savedWishItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} );

app.get( '/api/wishItems', cors( corsOptions ), async ( req, res ) =>
{
  
	try {
		const fetched = await WishItem.find();
		res.status(201).json(fetched);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
} );


app.delete( '/api/wishItems/:wishId', cors( corsOptions ), async ( req, res ) =>
{
  const { wishId } = req.params;
  console.log("deleting wishItem: ",wishId); 
  try
  {
    const wishItem = await WishItem.find( { wishId: wishId } );
    console.log("Fetched WishItem:: ",wishItem);
    const deleted = await WishItem.findByIdAndDelete(wishItem);
		res.status(201).json(deleted);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
} );

app.get('/api/wishItems/:wishId', cors(corsOptions), async (req, res) => {
	const { wishId } = req.params;
	console.log('fetching wishId: ', wishId);
	try {
		const wishItem = await WishItem.find({ wishId: wishId });
		console.log('Fetched WishItem:: ', wishItem);
		res.status(201).json(wishItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});


app.put('/api/wishItems', cors(corsOptions), async (req, res) => {
	const {_id, wishId, wishDesc, isCompleted, startDate, completeDate } = req.body;

	console.log(
    'Updating wishItem: ',
    _id,
		wishId,
		wishDesc,
		isCompleted,
		startDate,
		completeDate,
	);

  const updateWishItem = new WishItem( {
    _id,
		wishId,
		wishDesc,
		isCompleted,
		startDate: new Date(startDate),
		completeDate: completeDate ? new Date(completeDate) : null,
	});

  try
  {
    const updated = await WishItem.findByIdAndUpdate(
		_id,
		{
			wishDesc: updateWishItem.wishDesc,
			startDate: updateWishItem.startDate,
			completeDate: updateWishItem.completeDate,
		},
		{ new: true},
	);
    console.log('updated: ',updated);
		res.status(201).json(updated);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});



