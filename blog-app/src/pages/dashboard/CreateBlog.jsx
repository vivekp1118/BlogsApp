import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { axiosInstance } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Loader } from '../../components/Loader';

export const CreateBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        blogType: 'public'
    });

    const [isPreview, setIsPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            fetchBlog(id);
        }
    }, [id]);

    const fetchBlog = (blogId) => {
        axiosInstance
            .get(`/blog/${blogId}`)
            .then((res) => {
                const blogData = res.data.result;
                setFormData({
                    title: blogData.title,
                    content: blogData.content,
                    tags: blogData.tags.join(', '),
                    blogType: blogData.blogType
                });
            })
            .catch((err) => {
                console.error(err);
                toast.error(
                    err?.response?.data?.message || 'Failed to fetch blog'
                );
            })
            .finally(() => setIsLoading(false));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const postData = {
                title: formData.title,
                content: formData.content,
                tags: formData.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== ''),
                blogType: formData.blogType
            };

            let apiCall;
            if (isEditMode) {
                apiCall = axiosInstance.patch(`/blog/${id}`, postData);
            } else {
                apiCall = axiosInstance.post(`/blog/`, postData);
            }

            apiCall
                .then((res) => {
                    const successMessage = isEditMode
                        ? 'Blog updated successfully'
                        : 'Blog created successfully';
                    toast.success(successMessage);
                    navigate('/dashboard/my-blogs');
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(
                        err?.response?.data?.message || 'An error occurred'
                    );
                })
                .finally(() => setIsLoading(false));

            if (!isEditMode) {
                setFormData({
                    title: '',
                    content: '',
                    tags: '',
                    blogType: 'private'
                });
            }
        } catch (error) {
            console.error('Error with blog post:', error);
            toast.error('Failed to process blog post. Please try again.');
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]:
                type === 'checkbox' ? (checked ? 'public' : 'private') : value
        }));
    };

    const handlePreview = () => {
        setIsPreview(true);
    };

    const handleEdit = () => {
        setIsPreview(false);
    };

    const displayTags = formData.tags
        ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag !== '')
              .join(', ')
        : '';

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <Navbar />
            <div className="mx-auto min-h-screen max-w-3xl bg-gray-50 p-4">
                <div className="w-full rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">
                        {isPreview
                            ? 'Preview Post'
                            : isEditMode
                              ? 'Edit Blog Post'
                              : 'Create New Blog Post'}
                    </h2>

                    {isPreview ? (
                        <div className="preview-container">
                            <div className="mb-2 text-sm text-gray-500">
                                {formData.blogType === 'public'
                                    ? 'Public Post'
                                    : 'Private Post'}
                            </div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900">
                                {formData.title || 'Untitled Post'}
                            </h1>

                            <div className="prose prose-lg prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-blue-600 mb-6 max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {formData.content || 'No content yet...'}
                                </ReactMarkdown>
                            </div>

                            {displayTags && (
                                <div className="mb-6">
                                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                                        Tags:
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.split(',').map(
                                            (tag, index) =>
                                                tag.trim() && (
                                                    <span
                                                        key={index}
                                                        className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-700"
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                )
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={handleEdit}
                                    className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
                                >
                                    Back to Editing
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                >
                                    Publish Post
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Post Title:
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter your post title..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Content:{' '}
                                    <span className="text-xs text-gray-500">
                                        (Supports Markdown)
                                    </span>
                                </label>
                                <textarea
                                    className="min-h-[250px] w-full rounded-md border-2 border-gray-200 p-2 font-mono text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your post content here using Markdown..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Tags:
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="technology, programming, react (comma separated)"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="isPublic"
                                    type="checkbox"
                                    name="blogType"
                                    checked={formData.blogType === 'public'}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="isPublic"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Make this post public
                                </label>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={handlePreview}
                                    className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
                                >
                                    Preview
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                >
                                    {isEditMode ? 'Update Post' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <Toaster />
        </>
    );
};
