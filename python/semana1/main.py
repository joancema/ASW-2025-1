# Variables
nombre = "Python"
version = 3.9
es_activo = True
pi = 3.14159

# Listas
frutas = ["manzana", "pera", "plátano", "naranja"]
numeros = [1, 2, 3, 4, 5]

# Diccionarios
persona = {
    "nombre": "Juan",
    "edad": 25,
    "ciudad": "Madrid",
    "habilidades": ["Python", "JavaScript", "SQL"]
}

# Funciones con argumentos variables
def suma(*args):
    return sum(args)

def mostrar_info(**kwargs):
    for clave, valor in kwargs.items():
        print(f"{clave}: {valor}")

# Clase
class Estudiante:
    def __init__(self, nombre, edad, curso):
        self.nombre = nombre
        self.edad = edad
        self.curso = curso
    
    def mostrar_info(self):
        return f"Estudiante: {self.nombre}, Edad: {self.edad}, Curso: {self.curso}"

# Ejemplos de uso
if __name__ == "__main__":
    # Uso de variables y listas
    print(f"Versión de {nombre}: {version}")
    print(f"Primera fruta: {frutas[0]}")
    
    # Uso de diccionarios
    print(f"Ciudad de {persona['nombre']}: {persona['ciudad']}")
    
    # Uso de funciones con argumentos variables
    resultado = suma(1, 2, 3, 4, 5)
    print(f"Suma: {resultado}")
    
    mostrar_info(nombre="Ana", edad=30, profesion="Ingeniera")
    
    # Uso de clase
    estudiante = Estudiante("María", 20, "Python")
    print(estudiante.mostrar_info())

# Nota: En Python, no existen callbacks en el mismo sentido que en JavaScript
# En su lugar, usamos funciones de orden superior o decoradores

# Simulación de promesas usando asyncio
import asyncio

async def tarea_asincrona(nombre, segundos):
    print(f"Iniciando {nombre}")
    await asyncio.sleep(segundos)
    print(f"Completado {nombre}")
    return f"Resultado de {nombre}"

async def main_async():
    # Ejecución concurrente de tareas
    tareas = [
        tarea_asincrona("Tarea 1", 2),
        tarea_asincrona("Tarea 2", 1),
        tarea_asincrona("Tarea 3", 3)
    ]
    
    resultados = await asyncio.gather(*tareas)
    print("Todos los resultados:", resultados)

# Ejecutar el código asíncrono
if __name__ == "__main__":
    asyncio.run(main_async())
