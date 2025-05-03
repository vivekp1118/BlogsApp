import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Edit, Trash } from 'lucide-react';
import moment from 'moment';

export const BlogCards = ({
    _id,
    title,
    content,
    tags,
    authorId,
    selfBlog,
    createdAt,
    blogType,
    deleteBlog
}) => {
    const { pathname } = useLocation();
    const isSelected = pathname.endsWith(`blog/${_id}`);

    const truncatedContent =
        content.length > 150 ? content.substring(0, 150) + '...' : content;

    return (
        <div
            key={_id}
            className={`flex w-full max-w-[360px] flex-col rounded-xl border-2 ${
                isSelected ? 'border-blue-500' : 'border-gray-200'
            } relative bg-white p-6 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl`}
        >
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                {title}
            </h2>

            <p className="mb-4 text-sm leading-6 text-gray-700">
                <ReactMarkdown>{truncatedContent}</ReactMarkdown>
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-800 shadow"
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="mb-4 text-sm text-gray-600">
                <div className="mb-1">
                    <span className="text-gray-500">By </span>
                    <span className="font-semibold text-gray-800">
                        {authorId.userName}
                    </span>
                    <span className="ml-2 italic text-gray-500">
                        {moment(createdAt).utcOffset('+05:30').fromNow()}
                    </span>
                </div>

                <div className="text-xs text-gray-500">
                    <span className="font-semibold">Posted on:</span>
                    {moment(createdAt)
                        .utcOffset('+05:30')
                        .format('DD MMM YYYY, hh:mm A')}
                </div>
            </div>

            <div className="mt-auto flex justify-between">
                <Link to={`/dashboard/blog/${_id}`}>
                    <button
                        className={`inline-block rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors ${
                            isSelected ? 'bg-blue-500' : 'hover:bg-gray-900'
                        }`}
                    >
                        View Details
                    </button>
                </Link>
                {selfBlog && (
                    <div className="flex gap-3">
                        <Link
                            to={`/dashboard/update-blog/${_id}`}
                            className="flex items-center justify-center rounded-md bg-gray-800 p-2 text-white transition hover:bg-gray-900"
                            title="Edit"
                        >
                            <Edit className="h-5 w-5" />
                        </Link>

                        <button
                            onClick={() => deleteBlog(_id)}
                            className="flex items-center justify-center rounded-md bg-red-600 p-2 text-white transition hover:bg-red-700"
                            title="Delete"
                        >
                            <Trash className="h-5 w-5" />
                        </button>
                    </div>
                )}
                {selfBlog && (
                    <div className="text-blue-600-500 absolute right-[-1px] top-2 rounded-sm bg-gray-800 px-2 text-xs uppercase text-white">
                        {blogType}
                    </div>
                )}
            </div>
        </div>
    );
};
