import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

// Create a new user
export const createUser = async (name: string, email: string) => {
    const user = new User();
    user.name = name;
    user.email = email;
    return await AppDataSource.manager.save(user);
};

// Read all users
export const getAllUsers = async () => {
    return await AppDataSource.manager.find(User);
};

// Read user by id
export const getUserById = async (id: number) => {
    return await AppDataSource.manager.findOne(User, { where: { id } });
};

// Update user
export const updateUser = async (id: number, name: string, email: string) => {
    const user = await getUserById(id);
    if (user) {
        user.name = name;
        user.email = email;
        return await AppDataSource.manager.save(user);
    }
    return null;
};

// Delete user
export const deleteUser = async (id: number) => {
    const user = await getUserById(id);
    if (user) {
        await AppDataSource.manager.remove(user);
        return true;
    }
    return false;
};

// Initialize database and run example
AppDataSource.initialize()
    .then(async () => {
        console.log("Database connection established");

        try {
            // Example usage
            const newUser = await createUser("John Doe", "john@example.com");
            console.log("Created user:", newUser);

            const allUsers = await getAllUsers();
            console.log("All users:", allUsers);

            const user = await getUserById(newUser.id);
            console.log("Found user:", user);

            const updatedUser = await updateUser(newUser.id, "John Updated", "john.updated@example.com");
            console.log("Updated user:", updatedUser);

            const deleted = await deleteUser(newUser.id);
            console.log("User deleted:", deleted);
        } catch (error) {
            console.error("Error:", error);
        }
    })
    .catch((error) => console.log("TypeORM connection error: ", error));

