"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import imgg from "@/public/images/doctor.png"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useGetBlogsQuery, useDeleteBlogPostMutation } from "@/redux/api/blogApi"
import { toast } from "react-hot-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ContentManagement = () => {
  const ITEMS_PER_PAGE = 3
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null)

  const { data: blogsData, isLoading, isError, refetch } = useGetBlogsQuery({})
  const [deleteBlogPost] = useDeleteBlogPostMutation()

  const handleDeleteClick = (blogId: string) => {
    setBlogToDelete(blogId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return
    
    try {
      await deleteBlogPost(blogToDelete).unwrap()
      toast.success("Blog deleted successfully")
      refetch() 
    } catch (error) {
      toast.error("Failed to delete blog")
      console.error("Delete error:", error)
    } finally {
      setDeleteDialogOpen(false)
      setBlogToDelete(null)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Blog</h1>
        <p>Loading blogs...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Blog</h1>
        <p className="text-red-500">Error loading blogs. Please try again later.</p>
      </div>
    )
  }

  // Transform the API response data to match our frontend structure
  const transformedBlogs = blogsData?.data?.blogs?.map(blog => ({
    id: blog._id,
    author: blog.author,
    role: "Orthopedic Specialist",
    date: new Date(blog.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }),
    content: blog.content
  })) || []

  const filteredBlogs = transformedBlogs.filter(
    (blog) =>
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Blog</h1>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search blogs by keyword or author..."
          className="pl-10 bg-white focus:outline-none"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {paginatedBlogs.length > 0 ? (
        <div className="space-y-4">
          {paginatedBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-2">
                <Image
                  src={imgg || "/placeholder.svg"}
                  alt={`${blog.author} avatar`}
                  className="w-12 h-12 rounded-full object-cover"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{blog.author}</p>
                  <p className="text-xs text-gray-500">{blog.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{blog.content}</p>
              <p className="text-xs text-gray-400">{blog.date}</p>
              <Button 
                variant="destructive" 
                className="mt-4"
                onClick={() => handleDeleteClick(blog.id)}
              >
                Delete Blog
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No blogs found matching your search.</p>
        </div>
      )}

      {filteredBlogs.length > 0 && (
        <Pagination className="mt-6">
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={currentPage > 1 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
          />
          <PaginationContent>
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  isActive={currentPage === pageIndex + 1}
                  onClick={() => handlePageChange(pageIndex + 1)}
                  className="cursor-pointer"
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            className={currentPage < totalPages ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
          />
        </Pagination>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ContentManagement