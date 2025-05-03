import { badRequest, created, notFound, success } from "../../../utils/responseHandler.js";
import { handleError } from "../../../utils/handleError.js";
import { z } from "zod";
import { removeFields } from "../../../utils/removeFields.js";
import Blog from "./blog.model.js";

const blogTypes = z.enum(["public", "private"]);

const blogSchema = z.object({
    title: z.string().min(1, "title is required"),
    content: z.string().min(4, "Content is required"),
    tags: z.array(z.string()).optional(),
    blogType: blogTypes.optional()
});

const updateBlogSchema = blogSchema.partial();

const createBlog = async (req, res) => {
    try {
        const result = blogSchema.safeParse(req.body);
        if (!result.success) throw result.error;

        const { title, content, tags, blogType = 'public' } = req.body;
        const blog = await Blog.create({ title, content, tags, authorId: req.user._id, blogType });
        const blogDetails = removeFields(blog, [], true);
        return created(res, blogDetails, "Blog created successfully");
    } catch (error) {
        return handleError(error, res);
    }
};

const getUsersBlogs = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const blogs = await Blog.find({authorId: req.user._id}).populate("authorId").sort({ createdAt: -1 }).skip(skip).limit(limit);
        const count = await Blog.countDocuments({authorId: req.user._id});
        const totalPages = Math.ceil(count / limit);

        return success(res, { blogs, totalPages }, "Blogs fetched successfully");
    } catch (error) {
        return handleError(error, res);
    }
};


const getAllUsersBlogs = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({blogType: "public"}).populate("authorId", "userName createdAt").sort({ createdAt: -1 }).skip(skip).limit(limit);
        const count = await Blog.countDocuments({blogType: "public"});
        const totalPages = Math.ceil(count / limit);

        return success(res, { blogs, totalPages }, "Blogs fetched successfully");
    } catch (error) {
        return handleError(error, res);   
    }
};


const removeBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        const blogDetails = removeFields(blog, [], true);
        return success(res, blogDetails, "Blog removed successfully");
    } catch (error) {
        return handleError(error, res);   
    }
};


const updateBlog = async (req, res) => {
    try {
    
        const result  = updateBlogSchema.safeParse(req.body)
        if(!result.success) throw result.error;
        if(!req.params.id) return badRequest(res, "Blog id is required");

        // add enum validation
        let blog = await Blog.findOneAndUpdate({
            _id: req.params.id,
            authorId: req.user._id
        }, result.data, { new: true });

               
        if(!blog) return notFound(res, "Blog not found");
        const blogDetails = removeFields(blog, [], true);
        return success(res, blogDetails, "Blog updated successfully");
    } catch (error) {
        return handleError(error, res);   
    }
};

const getBlogDetails = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            _id: req.params.id,
            authorId: req.user._id
        }).populate("authorId", "userName createdAt");
        return success(res, blog, "Blog fetched successfully");
    } catch (error) {
        return handleError(error, res);   
    }
};
export {
    createBlog,
    getUsersBlogs, 
    getAllUsersBlogs,
    removeBlog,
    updateBlog,
    getBlogDetails
} 