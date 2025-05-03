import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { Navbar } from '../../components/Navbar';
import { Loader } from '../../components/Loader';

export default function Preview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState({});

    useEffect(() => {
        axiosInstance
            .get(`/blog/${id}`)
            .then((res) => {
                setBlog(res.data.result);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error(
                    err?.response?.data?.message || 'Failed to fetch blog'
                );
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleGoBack = () => navigate(-1);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto max-w-screen-lg px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-lg sm:p-8">
                    {/* Title & Button */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            {blog.title}
                        </h1>
                        <button
                            onClick={handleGoBack}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:shadow sm:w-auto"
                        >
                            ← Go back
                        </button>
                    </div>

                    {/* Content */}
                    <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                        <ReactMarkdown>{blog.content}</ReactMarkdown>
                    </div>

                    {/* Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Meta */}
                    <div className="mt-6 space-y-1 text-sm text-gray-600">
                        <p>
                            By{' '}
                            <span className="font-semibold">
                                {blog.authorId?.userName || 'Unknown Author'}
                            </span>
                        </p>
                        <p>
                            Posted on{' '}
                            {new Date(blog.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <Toaster position="bottom-center" />
            </div>
        </>
    );
}
