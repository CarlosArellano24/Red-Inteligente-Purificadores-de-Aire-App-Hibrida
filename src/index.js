import { 
    initializeApp 
} from "firebase/app";

import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged, 
    connectAuthEmulator 
} from 'firebase/auth';

import { 
    BluetoothSerial 
} from '@ionic-native/bluetooth-serial';

import {
    Platform
} from '@ionic/angular';

const firebaseConfig = {
  apiKey: "AIzaSyB59QXwzGzzlc1DlIq4bn-8rGYNl-YEFIQ",
  authDomain: "red-purificadores.firebaseapp.com",
  databaseURL: "https://red-purificadores-default-rtdb.firebaseio.com",
  projectId: "red-purificadores",
  storageBucket: "red-purificadores.appspot.com",   
  messagingSenderId: "465692295067",
  appId: "1:465692295067:web:63afb8986188b79c06eb3e",
  measurementId: "G-YQG5EHENT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const btnIniciarSesion  = document.getElementById('btnIniciarSesion');
const conSesionIniciada = document.getElementById('conSesionIniciada');
const conSesionCerrada  = document.getElementById('conSesionCerrada');
const detallesDeUsuario = document.getElementById('detallesDeUsuario');
const cuerpo            = document.getElementById('cuerpo');



const auth = getAuth(app);
const provider = new GoogleAuthProvider();

btnIniciarSesion.onclick = () => signInWithPopup(auth, provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log('Sesion iniciada con exito');
    })
    .catch((error) => {
        console.log('Error al iniciar sesion');
        console.log(error.code);
        console.log(error.message);
    });

btnCerrarSesion.onclick = () => signOut(auth)
    .then((result) => {
        console.log('Sesion cerrada con exito');
    })
    .catch((error) => {
        console.log(error.code);
        console.log(error.message);
    });

onAuthStateChanged(auth, user => {
    if (user != null) {
        conSesionIniciada.hidden = false;
        conSesionCerrada.hidden = true;
        cuerpo.hidden = false;
        // detallesDeUsuario.hidden = false;
        detallesDeUsuario.innerHTML = `<h3>Hola ${user.displayName}!</h3>`;
            // <p>ID de usuario: ${user.uid}</p>
    } else {
        conSesionIniciada.hidden = true;
        conSesionCerrada.hidden = false;
        cuerpo.hidden = true;
        // detallesDeUsuario.hidden = true;
        detallesDeUsuario.innerHTML = `<h3>Inicia Sesión! 👉</h3>`;
    }
});

// Configurar Bluetooth y backgroud task

const platform = Platform();            //Estas lineas causan fallas por las dependencias de Angular, buscar otro metodo para conocer la plataforma
const bluetooth = BluetoothSerial();

const buscarConexion = async () => {
    return new Promise((resolve, reject) => {
        if (bluetooth.isEnabled()) {
            let dispositivos;
            bluetooth.list()
                .then((response) => {
                    dispositivos = response;
                });
        
            dispositivos.forEach(dispositivo => {
                if (dispositivo.name === 'PurLuft') {
                    if (platform.is('ios'))     bluetooth.connect(dispositivo.uuid);
                    if (platform.is('android')) bluetooth.connect(dispositivo.address);
                }
            });
        }
        resolve(true);
    });
}

// Mostrar pagina de carga

document.addEventListener('DOMContentLoaded', () => {
    new Promise(resolve => { setTimeout(resolve, 1000) })
        .then(() => {
            document.querySelector('.pagina').style.display = 'block';
            document.querySelector('#cargandoPagina').style.display = 'none';
        });
});

//determinar en que plataforma se trabaja y configurar backgournd fetch 

if (this.platform.is('ios')) {
    var backgroundFetchConfig = {
        minimumFetchInterval: 15
    }
} else if (this.platform.is('android')) {
    var backgroundFetchConfig = {
        minimumFetchInterval: 15,
        enableHeadless: false,   
        stopOnTerminate: true, 
        startOnBoot: true,
        forceAlarmManager: false,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
        requiresBatteryNotLow: false,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresStorageNotLow: false
    }
}

let status = BackgroundFetch.configure(backgroundFetchConfig, async (taskId) => {
        console.log("[Background fetch] taskId: ", taskId);
        const result = await buscarConexion();

        BackgroundFetch.finish(taskId);
    }, async (taskId) => {
        BackgroundFetch.finish(taskId); 
    });

if (location.hostname === 'localhost')  {
    connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(db,'localhost', 8080);
}

/* // Funcion que posiblemente sea util en el futuro
function setVisible(elementOrSelector, visible) {
    // This bit is so you can pass in the name as a string or the reference directly
    (typeof elementOrSelector === 'string' ?
        document.querySelector(elementOrSelector) : elementOrSelector)
    .style.display =
        visible ? 'block' : 'none';
}
*/