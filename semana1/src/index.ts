console.log("Argumentos de entrada:", process.argv);

const [op, aStr, bStr] = process.argv.slice(2);
const a = parseFloat(aStr);
const b = parseFloat(bStr);

switch (op) {
    case "sum":
        console.log(`Suma: ${a + b}`);
        break;
    case "mult":
        console.log(`Multiplicación: ${a * b}`);
        break;
    default:
        console.log("Operación no válida");
}

function sumar(x: number, y: number): number {
    return x + y;
}

const multiplicar = (x: number, y: number): number => x * y;

interface Estudiante {
    id: number;
    nombre: string;
    edad: number;
}

const estudiantes: Estudiante[] = [
    { id: 1, nombre: "Juan", edad: 20 },
    { id: 2, nombre: "María", edad: 22 },
    { id: 3, nombre: "Pedro", edad: 21 }
];

const calculadora = {
    suma: (x: number, y: number) => x + y,
    resta: (x: number, y: number) => x - y,
    multiplicacion: (x: number, y: number) => x * y,
    division: (x: number, y: number) => y !== 0 ? x / y : "Error: División por cero"
};

const numeros = [1, 2, 3];
const masNumeros = [...numeros, 4, 5];

function sumarTodos(...nums: number[]): number {
    return nums.reduce((acc, curr) => acc + curr, 0);
}

class Persona {
    constructor(private nombre: string, private edad: number) {}

    public presentarse(): string {
        return `Hola, soy ${this.nombre} y tengo ${this.edad} años`;
    }

    public cumplirAnios(): void {
        this.edad++;
    }
}

// Callback mejorado con manejo de errores (Error-first callback pattern)
function procesarDatosCallback(
    datos: string, 
    callback: (error: Error | null, resultado?: string) => void
): void {
    setTimeout(() => {
        if (!datos) {
            callback(new Error("No hay datos para procesar"));
            return;
        }

        try {
            // Simulamos algún procesamiento que podría fallar
            if (datos.length < 3) {
                throw new Error("Los datos son demasiado cortos");
            }
            callback(null, `Datos procesados: ${datos}`);
        } catch (error) {
            callback(error instanceof Error ? error : new Error('Error desconocido'));
        }
    }, 1000);
}

// Ejemplo de uso del callback mejorado
function ejemploCallback() {
    // Caso exitoso
    procesarDatosCallback("datos de prueba", (error, resultado) => {
        if (error) {
            console.error("Error en el procesamiento:", error.message);
            return;
        }
        console.log("Callback exitoso:", resultado);
    });

    // Caso de error - datos vacíos
    procesarDatosCallback("", (error, resultado) => {
        if (error) {
            console.error("Error en el procesamiento:", error.message);
            return;
        }
        console.log("Callback exitoso:", resultado);
    });

    // Caso de error - datos muy cortos
    procesarDatosCallback("ab", (error, resultado) => {
        if (error) {
            console.error("Error en el procesamiento:", error.message);
            return;
        }
        console.log("Callback exitoso:", resultado);
    });
}

function procesarDatosPromise(datos: string): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (datos) {
                resolve(`Datos procesados: ${datos}`);
            } else {
                reject("Error: No hay datos para procesar");
            }
        }, 1000);
    });
}

async function procesarDatosAsync(datos: string): Promise<string> {
    try {
        const resultado = await procesarDatosPromise(datos);
        return resultado;
    } catch (error) {
        return `Error: ${error}`;
    }
}

async function ejecutarEjemplos() {
    console.log("Suma:", sumar(5, 3));
    console.log("Multiplicación:", multiplicar(4, 2));

    console.log("Estudiantes mayores de 20:",
        estudiantes.filter(est => est.edad > 20)
    );

    console.log("Calculadora:", calculadora.suma(10, 5));

    console.log("Suma de varios números:", sumarTodos(1, 2, 3, 4, 5));
    console.log("Array con spread:", masNumeros);

    const persona = new Persona("Ana", 25);
    console.log(persona.presentarse());
    persona.cumplirAnios();
    console.log(persona.presentarse());

    // Uso del callback mejorado
    console.log("\n--- Ejemplos de Callbacks con manejo de errores ---");
    ejemploCallback();

    procesarDatosPromise("datos")
        .then(resultado => console.log("Promise:", resultado))
        .catch(error => console.error("Error:", error));

    const resultadoAsync = await procesarDatosAsync("async data");
    console.log("Async/Await:", resultadoAsync);
}

ejecutarEjemplos();
