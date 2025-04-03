'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import imgg from '@/public/images/doctor.png'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { useGetBlogsQuery, useDeleteBlogPostMutation } from '@/redux/api/blogApi';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
// const blogData = [
//     {
//         id: 1,
//         author: 'Dr. Abebe Bekele, M.S.',
//         role: 'Orthopedic Specialist',
//         date: '04 Sep 2019, 09:35, Friday',
//         content: 'Eating a variety of foods from all food groups ensures that you get all necessary nutrients. It is important to include fruits, vegetables, grains, protein, and dairy in your diet. A balanced diet helps maintain a healthy weight, reduces the risk of chronic diseases, and promotes overall health.'
//     },
//     {
//         id: 2,
//         author: 'Dr. Almaz Tadesse, M.S.',
//         role: 'Orthopedic Specialist',
//         date: '04 Sep 2019, 09:35, Friday',
//         content: 'Regular physical activity can improve your muscle strength and boost your endurance. Exercise delivers oxygen and nutrients to your tissues and helps your cardiovascular system work more efficiently. It also helps to maintain a healthy weight, reduce the risk of chronic diseases, and improve mental health.'
//     },
//     {
//         id: 3,
//         author: 'Dr. Biruk Alemu, M.S.',
//         role: 'Orthopedic Specialist',
//         date: '04 Sep 2019, 09:35, Friday',
//         content: 'Adequate sleep is a key part of a healthy lifestyle and can benefit your heart, weight, mind, and more. It helps your body repair and be ready for another day. Poor sleep can lead to various health issues, including heart disease, diabetes, and depression.'
//     },
//     {
//         id: 4,
//         author: 'Dr. Dagmawit Tesfaye, M.S.',
//         role: 'Orthopedic Specialist',
//         date: '04 Sep 2019, 09:35, Friday',
//         content: 'Drinking enough water each day is crucial for many reasons: to regulate temperature, keep joints lubricated, prevent infections, deliver nutrients to cells, and keep organs functioning properly. Staying hydrated improves sleep quality, cognition, and mood. It also helps to maintain a healthy weight and prevent kidney stones.'
//     },
//     {
//         id: 5,
//         author: 'Dr. Fikre Mekonnen, M.S.',
//         role: 'Orthopedic Specialist',
//         date: '04 Sep 2019, 09:35, Friday',
//         content: 'A balanced diet is one that gives your body the nutrients it needs to function correctly. It is important to get the right amount of nutrients from each food group. This includes consuming the right portions of fruits, vegetables, grains, protein, and dairy. A balanced diet helps to maintain a healthy weight and reduce the risk of chronic diseases.'
//     }
// ];

const ContentManagement = () => {
    const ITEMS_PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
    //  const { data: blogData = [], isLoading, isError, refetch } = useGetBlogsQuery({});
    const { data: response, isLoading, isError, refetch } = useGetBlogsQuery({});
    const blogs = response?.data?.blogs || [];
     
     const [deleteBlogPost] = useDeleteBlogPostMutation();
      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };
      const handleDeleteClick = (blogId: string) => {
        setBlogToDelete(blogId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!blogToDelete) return;
        
        try {
            await deleteBlogPost(blogToDelete).unwrap();
            toast.success('Blog post deleted successfully');
            refetch(); // Refresh the list after deletion
        } catch (error) {
            toast.error('Failed to delete blog post');
            console.error('Delete error:', error);
        } finally {
            setDeleteDialogOpen(false);
            setBlogToDelete(null);
        }}

      if (isLoading) return <div className="container mx-auto p-6">Loading...</div>;
      if (isError) return <div className="container mx-auto p-6">Error Loading blogs</div>;
      const paginatedBlogs = blogs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )|| [];
const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE) || 0;

return (
  <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Blog</h1>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                      This action cannot be undone. This will permanently delete the blog post.
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDelete}>
                      Delete
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      <div className="space-y-4">
          {paginatedBlogs.map((blog) => (
              <div 
                  key={blog._id} 
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                  <div className="flex items-center gap-4 mb-2">
                      <Image 
                          src={imgg} 
                          alt={`${blog.author} avatar`}
                          className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                          <p className="text-sm font-medium text-gray-800">{blog.author}</p>
                          <p className="text-xs text-gray-500">Orthopedic Specialist</p>
                      </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{blog.content}</p>
                  <p className="text-xs text-gray-400">{new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      weekday: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                  })}</p>
                  <Button 
                      variant="destructive" 
                      className="mt-4"
                      onClick={() => handleDeleteClick(blog._id)}
                  >
                      Delete Blog
                  </Button>
              </div>
          ))}
      </div>

      {totalPages > 1 && (
          <Pagination className="mt-4">
              <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} 
                  className="cursor-pointer" 
              />
              <PaginationContent>
                  {Array.from({ length: totalPages }).map((_, pageIndex) => (
                      <PaginationItem key={pageIndex}>
                          <PaginationLink
                              isActive={currentPage === pageIndex + 1}
                              onClick={() => handlePageChange(pageIndex + 1)}
                          >
                              {pageIndex + 1}
                          </PaginationLink>
                      </PaginationItem>
                  ))}
              </PaginationContent>
              <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} 
                  className="cursor-pointer" 
              />
          </Pagination>
      )}
  </div>
);
};

export default ContentManagement;