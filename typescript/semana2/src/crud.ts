import { User } from "./entity/User";
import { View } from "./entity/View";
import { AppDataSource } from "./data-source";

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

// Create view
export const createView = async (name: string, userId: number) => {
    const user = await getUserById(userId);
    if (user) {
        const view = new View();
        view.name = name;
        view.user = user;
        return await AppDataSource.manager.save(view);
    }
    return null;
};

// Read view by id
export const getViewById = async (id: number) => {
    return await AppDataSource.manager.findOne(View, { where: { id } });
};

//delete view
export const deleteView = async (id: number) => {
    const view = await getViewById(id);
    if (view) {
        await AppDataSource.manager.remove(view);
        return true;
    }
    return false;
};
