import React, { useState, useEffect } from 'react';
import { Trash2, Edit, PlusCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    date: '',
    content: '',
    images: [],
    tags: []
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:3001/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, images: e.target.value.split(',').map(img => img.trim()) });
  };

  const handleTagChange = (e) => {
    setForm({ ...form, tags: e.target.value.split(',').map(tag => tag.trim()) });
  };

  const handleAddBlog = () => {
    setCurrentBlog(null);
    setForm({
      title: '',
      author: '',
      date: new Date().toISOString().slice(0, 10), // Default to current date
      content: '',
      images: [],
      tags: []
    });
    setIsModalOpen(true);
  };

  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    setForm({
      title: blog.title,
      author: blog.author,
      date: blog.date,
      content: blog.content,
      images: blog.images.join(','),
      tags: blog.tags.join(',')
    });
    setIsModalOpen(true);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    try {
      await fetch(`http://localhost:3001/blogs/${id}`, {
        method: 'DELETE',
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogData = {
      ...form,
      images: Array.isArray(form.images) ? form.images : form.images.split(',').map(img => img.trim()),
      tags: Array.isArray(form.tags) ? form.tags : form.tags.split(',').map(tag => tag.trim()),
    };

    try {
      if (currentBlog) {
        await fetch(`http://localhost:3001/blogs/${currentBlog.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogData),
        });
      } else {
        await fetch('http://localhost:3001/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...blogData, id: Date.now().toString() }), // Simple ID generation
        });
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Blog</h2>
        <Button onClick={handleAddBlog} className="bg-green-500 hover:bg-green-600 text-white flex items-center space-x-2">
          <PlusCircle className="w-5 h-5" />
          <span>Thêm bài viết mới</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Tiêu đề</th>
              <th className="py-3 px-6 text-left">Tác giả</th>
              <th className="py-3 px-6 text-left">Ngày đăng</th>
              <th className="py-3 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{blog.title}</td>
                <td className="py-3 px-6 text-left">{blog.author}</td>
                <td className="py-3 px-6 text-left">{blog.date}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-4">
                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label={`Chỉnh sửa bài viết ${blog.title}`}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Xóa bài viết ${blog.title}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentBlog ? 'Chỉnh sửa bài viết Blog' : 'Thêm bài viết Blog mới'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tiêu đề</label>
            <Input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Tác giả</label>
            <Input
              type="text"
              id="author"
              name="author"
              value={form.author}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Ngày đăng</label>
            <Input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Nội dung</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleInputChange}
              required
              rows="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Hình ảnh (URL, cách nhau bằng dấu phẩy)</label>
            <Input
              type="text"
              id="images"
              name="images"
              value={form.images}
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Thẻ (cách nhau bằng dấu phẩy)</label>
            <Input
              type="text"
              id="tags"
              name="tags"
              value={form.tags}
              onChange={handleTagChange}
              className="mt-1 block w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Lưu
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogManagement;
