import {
  obtenerJoyas,
  obtenerJoyasPorFiltros,
  obtenerJoyasPorId,
} from "./db/consultas.js";
import express from "express";
import cors from "cors";
import { getDatabaseError } from "./lib/database.error.js";
import { reportMiddleware } from "./middlewares/middleWares.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(reportMiddleware);

app.listen(port, () => console.log(`Servidor iniciado en ${port}!`));

const prepararHATEOAS = (inventario) => {
  const results = inventario.map((m) => {
    return {
      name: m.nombre,
      href: `joyas/joya/${m.id}`,
    };
  });
  const totalJoyas = inventario.length;
  const stockTotal = inventario.reduce((a, e) => a + e.stock, 0);

  const HATEOAS = {
    totalJoyas,
    stockTotal,
    results,
  };
  console.log(stockTotal);
  return HATEOAS;
};

// GET

app.get("/joyas", async (req, res) => {
  try {
    const queryStrings = req.query;
    const inventario = await obtenerJoyas(queryStrings);
    const HATEOAS = await prepararHATEOAS(inventario);
    res.json(HATEOAS);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET CON FILTROS

app.get("/joyas/filtros", async (req, res) => {
  try {
    const queryStrings = req.query;
    const inventario = await obtenerJoyasPorFiltros(queryStrings);
    res.json(inventario);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET POR ID

app.get("/joyas/joya/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const joya = await obtenerJoyasPorId(id);

    res.json(joya);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "id inexistente" });
  }
});

// GET ERROR URL ERRONEA
app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});
