import 'dotenv/config';
import app from './app.js';
import { prisma } from './config/prisma.js';

const PORT = process.env.PORT || 3001;

async function runServer() {
  try {

    await prisma.$connect();
    console.log('Conexión a la base de datos PostgreSQL exitosa.');

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } 
  catch (error) {
    console.error('Error crítico al iniciar el servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

runServer();