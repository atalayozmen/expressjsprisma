import { PrismaClient } from "@prisma/client"
import express from "express";
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(
  express.json() ,
  cors({
    origin: '*',
  })
);

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.get('/', async (req, res) => {
  const techRadarElements = await prisma.techRadarElement.findMany();
  res.json(techRadarElements);
});

app.post('/', async (req, res) => {
  const { label, quadrant, ring, active, moved } = req.body;
  const techRadarElement = await prisma.techRadarElement.create({
    data: {
      id: Date.now(),
      label,
      quadrant,
      ring,
      active,
      moved,
    },
  });
  res.json(techRadarElement);
});

app.post('/addmany', async (req, res) => {
  const techRadarElements: Prisma.TechRadarElementCreateManyInput = req.body;

  const checkType = Prisma.validator<Prisma.TechRadarElementCreateManyInput>()(techRadarElements);
  //console.log('got techRadarElements: ', techRadarElements);

  console.log("checkType: ", checkType) 
  console.log("req body: ", req.body)

  try {
  const createdTechRadarElements = await prisma.techRadarElement.createMany({
    data: techRadarElements,
    skipDuplicates: true,
  });

  res.json(createdTechRadarElements);
  } catch (e) {
    console.log("error: ", e)
  }
});


app.put('/saveEntries', async (req, res) => {

  const techRadarElements: Prisma.TechRadarElementCreateManyInput = req.body;
 
  try{
    const deletedTechRadarElements = await prisma.techRadarElement.deleteMany({});
  }
  catch(e){
    console.log("saveentries error: Delete all failed: ")
  }

  try{
    
    const createdTechRadarElements = await prisma.techRadarElement.createMany({
      data: techRadarElements,
      skipDuplicates: true,
    });

    res.json(createdTechRadarElements);
  
  } catch (e) {
    console.log("saveEntries error: ", e)
  }

});

app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
