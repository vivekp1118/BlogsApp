import express from "express";
import userRoutes from "../src/services/user/user.routes.js";
import blogRoutes from "../src/services/blog/blog.routes.js";
const router = express.Router();

const defaultRoutes = [
    {
        path: "/user",
        route: userRoutes,
    },{
        path: "/blog",
        route: blogRoutes,
    }
];

defaultRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
