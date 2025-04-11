import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';

const Blogs = () => {

  const [expandedBlog, setExpandedBlog] = useState(null); // Track the expanded blog

  const handleSeeMore = (slug) => {
    setExpandedBlog(expandedBlog === slug ? null : slug); // Toggle the expanded view for the clicked blog
  };
  const [form, setForm] = useState({ title: '', content: '', description: '' });
  const [blogs, setBlogs] = useState([]);
  const [editSlug, setEditSlug] = useState(null);

  const API = `${import.meta.env.VITE_SERVER_URL}blog`;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/get/all`);
      setBlogs(res.data);
    } catch (error) {
      console.error('Error fetching blogs', error);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editSlug) {
        await axios.put(`${API}/update/${editSlug}`, form);
        setEditSlug(null);
      } else {
        await axios.post(`${API}/post`, form);
      }
      setForm({ title: '', content: '', description: '' });
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog', error);
    }
  };

  const handleEdit = (blog) => {
    setEditSlug(blog.slug);
    setForm({ title: blog.title, content: blog.content, description: blog.description });
  };

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`${API}/delete/${slug}`);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog', error);
    }
  };

  // File picker callback for image upload (local file as base64)
  const handleFilePicker = (callback, value, meta) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result; 
        callback(base64String, { alt: file.name });
      };

      if (file) {
        reader.readAsDataURL(file); 
      }
    };

    input.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{editSlug ? '✏️ Edit Blog' : '➕ Add Blog'}</h2>

      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6">
        <textarea
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          type="text"
          name="content"
          placeholder="Short Content"
          value={form.content}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
        />
        <Editor
          apiKey={import.meta.env.VITE_EDITOR_API_KEY}
          name="description"
          placeholder="Full Description"
          value={form.description}
          onEditorChange={(newContent, editor) => {
            setForm((prevForm) => ({
              ...prevForm,
              description: newContent,
            }));
          }}
          className="w-full p-2 mb-2 border rounded"
          init={{
            height: 300,
            menubar: false,
            plugins:
              'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            file_picker_callback: handleFilePicker, 
          }}
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editSlug ? 'Update' : 'Post'}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">📚 All Blogs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {blogs.map((blog) => (
        <div key={blog._id} className="border p-4 rounded shadow bg-white">
          <h3 className="text-lg font-semibold">{blog.title}</h3>
          <p className="text-gray-700">{blog.content}</p>
          <p className="text-sm mt-2">
            {blog.description.length > 100 ? (
              <>
                {expandedBlog === blog._id ? (
                  // Show full description if expanded
                  <span dangerouslySetInnerHTML={{ __html: blog.description || '' }} />
                ) : (
                  // Show truncated description with "See More"
                  <span dangerouslySetInnerHTML={{ __html: blog.description.slice(0, 100) + '...' || '' }} />
                )}
                <button
                  onClick={() => handleSeeMore(blog._id)}
                  className="text-blue-500 underline ml-2"
                >
                  {expandedBlog === blog._id ? 'See Less' : 'See More'}
                </button>
              </>
            ) : (
              // Show the full description if it's less than 100 characters
              <span dangerouslySetInnerHTML={{ __html: blog.description || '' }} />
            )}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleEdit(blog)}
              className="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(blog.slug)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>

    </div>
  );
};

export default Blogs;
