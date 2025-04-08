'use client';
import { PostCard } from "@/components/doctor-components/PostCard";
import Image from "next/image";
import ppimage from '@/public/images/doctor.png';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useGetBlogsQuery, useCreateBlogPostMutation, useDeleteBlogPostMutation } from "@/redux/api/blogApi";
import { useGetCurrentDoctorQuery } from "@/redux/api/doctorApi";
import { toast } from "react-hot-toast";
import type { BlogPost } from '@/types/blog';

const EducationCenter = () => {
  const { data: doctorData } = useGetCurrentDoctorQuery();
  // const doctorId = "doctorData?.data?._id || "DR Abiy"; 
  const doctorId= "67eb16337db753f356e1174d"

  // Fetch blogs data
  const { data: response, isLoading, error, refetch } = useGetBlogsQuery({});
  const blogs = response?.data?.blogs || [];

  // Blog mutations
  const [createBlogPost] = useCreateBlogPostMutation();
  const [deleteBlogPost] = useDeleteBlogPostMutation();
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    content?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Basic client-side validation
    if (!title.trim()) {
      setValidationErrors({ title: "Title is required" });
      toast.error("Title is required");
      return;
    }
    if (!content.trim()) {
      setValidationErrors({ content: "Content is required" });
      toast.error("Content is required");
      return;
    }

    try {
      await createBlogPost({
        author: doctorId,
        title,
        content,
        tags: [],
        published: true,
      }).unwrap();
      
      toast.success("Blog post created successfully!");
      setTitle("");
      setContent("");
      refetch(); // Refresh the blog list
    } catch (err: any) {
      if (err.data?.error) {
        // Handle API validation errors
        const errorMessage = err.data.error;
        
        if (errorMessage.includes('"title" length')) {
          setValidationErrors({
            title: "Title must be at least 5 characters long"
          });
          toast.error("Title must be at least 5 characters long");
        } else if (errorMessage.includes('"content" length')) {
          setValidationErrors({
            content: "Content must be at least 20 characters long"
          });
          toast.error("Content must be at least 20 characters long");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Failed to create blog post");
        console.error("Blog creation error:", err);
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteBlogPost(postId).unwrap();
        toast.success("Post deleted successfully");
        refetch(); // Refresh the blog list
      } catch (err) {
        toast.error("Failed to delete post");
        console.error("Delete error:", err);
      }
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading blogs...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading blogs</div>;

  // Sort blogs by creation date (newest first)
  const sortedBlogs = [...blogs].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Blog Creation Form */}
      <div className="bg-gradient-to-r from-orange-50 to-emerald-50 rounded-2xl shadow-lg p-6 flex items-start mb-6">
      <Image
          src={ppimage}
          alt="Doctor profile"
          className="w-12 h-12 rounded-full mr-4 border-2 border-green-500"
          width={48}
          height={48}
        />
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-2">
          <div>
          <Input
  value={title}
  onChange={(e) => {
    setTitle(e.target.value);
    if (validationErrors.title) {
      setValidationErrors((prev) => ({ ...prev, title: undefined }));
    }
  }}
  placeholder="Enter blog title atleast 5 letters..."
  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 border-none
              placeholder-gray-500 bg-gray-100 text-gray-900 shadow-sm 
              ${validationErrors.title ? "border-red-500 focus:ring-red-400" : "border-gray-300"}`}
/>

            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
            )}
          </div>
          <div>
          <Textarea
  value={content}
  onChange={(e) => {
    setContent(e.target.value);
    if (validationErrors.content) {
      setValidationErrors((prev) => ({ ...prev, content: undefined }));
    }
  }}
  placeholder="Write something insightful..."
  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 
              placeholder-gray-500 bg-gray-100 text-gray-900 shadow-sm resize-none
              ${validationErrors.content ? "border-red-500 focus:ring-red-400" : "border-gray-300"}`}
  rows={4}
/>

            {validationErrors.content && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Publish
            </Button>
          </div>
        </form>
      </div>

      {/* Blog List Section */}
      <h2 className="font-semibold text-lg mb-4">Latest Articles</h2>
      
      {sortedBlogs.length > 0 ? (
        <div className="space-y-4">
          {sortedBlogs.map((blog) => (
            <div 
              key={blog._id} 
              className={`relative group rounded-lg transition-colors cursor-pointer  w-full max-w-5xl min-h-[100px] p-4 shadow-md ${
                blog.author === doctorId 
                  ? "bg-emerald-50 border-l-4 border-emerald-500 hover:bg-emerald-100" 
                  : "bg-orange-50 border-l-4 border-orange-200 hover:bg-orange-100"
              }`}
            >
              <div className="flex items-start p-4">
                {/* Avatar with different positioning for user posts */}
                <div className={`flex-shrink-0 ${
                  blog.author === doctorId ? "order-2 ml-4" : "mr-4"
                }`}>
                  <Image
                    src={ppimage}
                    alt="Author"
                    className={`w-10 h-10 rounded-full ${
                      blog.author === doctorId 
                        ? "border-2 border-orange-500" 
                        : "border border-gray-300"
                    }`}
                    width={40}
                    height={40}
                  />
                  {blog.author === doctorId && (
                    <span className="text-xs text-orange-600 block text-center mt-1">
                      You
                    </span>
                  )}
                </div>

                {/* Post content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {blog.title || "Untitled Post"}
                      </h3>
                      {blog.author !== doctorId && (
                        <p className="text-sm text-gray-500">
                          {blog.author || "Anonymous Doctor"}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {blog.publishedAt ? 
                        new Date(blog.publishedAt).toLocaleDateString() : 
                        "Unknown date"}
                    </p>
                  </div>
                  
                  <p className="mt-2 text-gray-700 line-clamp-3">
                    {blog.content}
                  </p>
                  
                  {/* Read more button */}
                  <button 
                    onClick={() => setSelectedPost(blog)}
                    className="mt-2 text-sm text-orange-600 hover:text-orange-800"
                  >
                    Read more
                  </button>
                </div>
              </div>

              {/* Delete button (only for user's posts) */}
              {blog.author === doctorId && (
                <div className="absolute bottom-1 right-4 z-10">
                  <Button 
                    variant="outline"
                    className="text-emeralnd-600 border-emerald-300 hover:bg-emerald-50"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(blog._id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="mx-auto w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-2 text-gray-500">
            Be the first to share your knowledge with the community!
          </p>
          <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
            Create your first post
          </Button>
        </div>
      )}

      {/* Blog Detail Dialog */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedPost.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Image
                  src={ppimage}
                  alt="Author"
                  width={40}
                  height={40}
                  className={`rounded-full ${
                    selectedPost.author === doctorId 
                      ? "border-2 border-blue-500" 
                      : "border border-gray-300"
                  }`}
                />
                <div>
                  <p className="font-medium">
                    {selectedPost.author || "Anonymous Doctor"}
                    {selectedPost.author === doctorId && (
                      <span className="ml-2 text-sm text-blue-600">(You)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedPost.publishedAt ? 
                      new Date(selectedPost.publishedAt).toLocaleDateString() : 
                      "Unknown date"}
                  </p>
                </div>
              </div>
            </DialogHeader>
            <div className="prose max-w-none mt-4">
              {selectedPost.content}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EducationCenter;