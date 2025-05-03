import { axiosInstance } from '../../context/AuthContext';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BlogCards } from '../../components/BlogCard';
import { Navbar } from '../../components/Navbar';
import { Pagination } from '../../components/Pagination';
import { Loader } from '../../components/Loader';

export const Dashboard = ({ selfBlog = false }) => {
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    const getAllBlogs = async () => {
        setIsLoading(true);
        const url = selfBlog
            ? `/blog?page=${page}&limit=10`
            : `/blog/all?page=${page}&limit=10`;
        await axiosInstance
            .get(url)
            .then((res) => {
                if (res.data.result) {
                    setAllBlogs(res.data.result.blogs);
                    setTotalPages(res.data.result.totalPages);
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message);
            })
            .finally(setIsLoading(false));
    };

    const deleteBlog = async (id) => {
        setIsLoading(true);
        await axiosInstance
            .delete(`/blog/${id}`)
            .then((res) => {
                toast.success(res.data.message);
                getAllBlogs();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message);
            })
            .finally(setIsLoading(false));
    };

    useEffect(() => {
        getAllBlogs();
    }, [page, selfBlog]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-wrap justify-center gap-10 p-10">
                {allBlogs.length === 0 && (
                    <div className="flex h-[calc(100vh-20rem)] w-full items-center justify-center text-center text-2xl font-bold">
                        NO BLOGS FOUND !!
                    </div>
                )}

                {allBlogs.map((item) => {
                    return (
                        <BlogCards
                            _id={item._id}
                            title={item.title}
                            content={item.content}
                            tags={item.tags}
                            authorId={item.authorId}
                            createdAt={item.createdAt}
                            selfBlog={selfBlog}
                            blogType={item.blogType || ''}
                            deleteBlog={deleteBlog}
                        />
                    );
                })}
            </div>
            <Pagination
                totalPages={totalPages}
                page={page}
                onPageChange={(page) => setPage(page)}
            />
        </>
    );
};

export default Dashboard;
