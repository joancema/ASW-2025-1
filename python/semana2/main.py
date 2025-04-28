from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# Crear la base de datos y el motor
DATABASE_URL = "sqlite:///usuarios.db"
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Definir el modelo Usuario
class Usuario(Base):
    __tablename__ = "usuario"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)

# Crear las tablas
Base.metadata.create_all(bind=engine)

# Crear la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Funciones CRUD

def create_user(db: Session, name: str, email: str):
    """Crear un nuevo usuario"""
    db_user = Usuario(name=name, email=email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    """Obtener un usuario por ID"""
    return db.query(Usuario).filter(Usuario.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    """Obtener un usuario por email"""
    return db.query(Usuario).filter(Usuario.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Obtener todos los usuarios con paginación"""
    return db.query(Usuario).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, name: str = None, email: str = None):
    """Actualizar un usuario"""
    db_user = get_user(db, user_id)
    if db_user:
        if name is not None:
            db_user.name = name
        if email is not None:
            db_user.email = email
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """Eliminar un usuario"""
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

# Ejemplo de uso
if __name__ == "__main__":
    # Crear una sesión
    db = SessionLocal()
    
    try:
        # Crear un usuario
        nuevo_usuario = create_user(db, name="Juan Pérez", email="juan@example.com")
        print(f"Usuario creado: {nuevo_usuario.name}")
        
        # Obtener todos los usuarios
        usuarios = get_users(db)
        print("\nLista de usuarios:")
        for usuario in usuarios:
            print(f"ID: {usuario.id}, Nombre: {usuario.name}, Email: {usuario.email}")
        
        # Actualizar un usuario
        usuario_actualizado = update_user(db, nuevo_usuario.id, name="Juan Pérez Actualizado")
        print(f"\nUsuario actualizado: {usuario_actualizado.name}")
        
        # Eliminar un usuario
        delete_user(db, nuevo_usuario.id)
        print("\nUsuario eliminado")
        
    finally:
        db.close()
