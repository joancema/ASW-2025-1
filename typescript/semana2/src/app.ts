import { initializeDatabase } from "./database";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, createView, deleteView } from "./crud";

async function main() {
    try {
        // Initialize database
        await initializeDatabase();

        // Example usage
        const newUser = await createUser("John Doe", "john@example.com");
        console.log("Created user:", newUser);

        const newView= await createView("Consulta de datos", newUser.id );
        console.log("Created view:", newView);
        

        const allUsers = await getAllUsers();
        console.log("All users:", allUsers);

        const user = await getUserById(newUser.id);
        console.log("Found user:", user);

        const updatedUser = await updateUser(newUser.id, "John Updated", "john.updated@example.com");
        console.log("Updated user:", updatedUser);


        const deletedView = await deleteView(newView!.id);
        console.log("View deleted:", deletedView);

        const deleted = await deleteUser(newUser.id);
        console.log("User deleted:", deleted);

    } catch (error) {
        console.error("Error:", error);
    }
}

main();

