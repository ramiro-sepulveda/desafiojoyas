import fs from "fs";

// Acortar respuesta
const cortarRespuesta = (respuesta) => {
  const MAX_LENGTH = 50; // Número máximo de caracteres

  // Convertimos la respuesta a string
  const respuestaStr = JSON.stringify(respuesta);

  // Si la longitud supera el máximo, se corta la respuesta
  if (respuestaStr.length > MAX_LENGTH) {
    return respuestaStr.slice(0, MAX_LENGTH) + "...";
  }

  // Si la respuesta es corta, la devolvemos completa
  return respuestaStr;
};

// Generar reportes
export const reportMiddleware = (req, res, next) => {
  const rutaConsultada = req.originalUrl;
  const metodo = req.method;
  const fecha = new Date().toISOString();

  // Respuesta del servidor
  const originalSend = res.send;

  // Sobrescribimos res.send para capturar el contenido de la respuesta
  res.send = function (body) {
    // Acortamos la respuesta si es muy grande
    const respuestaCortada = cortarRespuesta(body);

    const log = `[${fecha}] Método: ${metodo}, Ruta: ${rutaConsultada}, Respuesta: ${respuestaCortada}\n`;

    // Guardamos el reporte en un archivo de texto
    fs.appendFile("reportes.log", log, (err) => {
      if (err) {
        console.error("Error al escribir el reporte:", err);
      }
    });

    // Llamamos al res.send original para enviar la respuesta al cliente
    return originalSend.call(this, body);
  };

  next(); // Continuamos con el flujo hacia las rutas
};
