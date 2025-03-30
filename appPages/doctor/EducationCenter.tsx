'use client';
import { PostCard } from "@/components/doctor-components/PostCard";
import Image, { StaticImageData } from "next/image";
import ppimage from '@/public/images/doctor.png';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SetStateAction, useState } from "react";

interface PostType {
    name: string;
    title: string;
    content: string;
    imageUrl: StaticImageData;
}

const EducationCenter = () => {
    const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

    const posts = [
      {
        name: "Dr. Ermiyas Kinde, MS.",
        title: "Orthopedics Specialist",
        content:"A balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats is essential for maintaining overall health and preventing chronic diseases. For instance, leafy greens like spinach provide vitamins A and K, while fruits like berries are packed with antioxidants. Proper hydration and portion control also play a vital role in optimal nutrition",
        imageUrl: ppimage, 
      },
      {
        name: "Dr. Solomon Abate, MS.",
        title: "Orthopedics Specialist",
        content:"Eating A Variety Of Foods From All Food Groups Ensures That You Get All Necessary Nutrients.",
        imageUrl: ppimage, 
      },
      {
        name: "Dr. Selam Engidawork, MS.",
        title: "Orthopedics Specialist",
        content:"Eating A Variety Of Foods From All Food Groups Ensures That You Get All Necessary Nutrients.",
        imageUrl: ppimage, 
      },
    ];

    const handlePostClick = (post: PostType) => {
        setSelectedPost(post);
    };
  
    return (
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center mb-6">
          <Image
            src={ppimage} 
            alt="User"
            className="w-12 h-12 rounded-full mr-4 border-2 border-green-500"
          />
          <form className="flex-grow flex items-center">
            <Input
              type="text"
              placeholder="Share Your Thoughts Dr..."
              className="flex-grow border-none focus:ring-0 focus:outline-none"
            />
            <Button type="submit" className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-orange-600">
              POST
            </Button>
          </form>
        </div>
        <h2 className="font-semibold text-lg mb-4">Latest</h2>
        {posts.map((post, index) => (
          <PostCard
            key={index}
            name={post.name}
            title={post.title}
            content={post.content}
            imageUrl={post.imageUrl}
            onClick={() => handlePostClick(post)}
          />
        ))}
        {selectedPost && (
            <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-xl">{selectedPost.name}</DialogTitle>
                        <DialogTitle>{selectedPost.title}</DialogTitle>
                        <DialogDescription className="text-lg">{selectedPost.content}</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )}
      </div>
    );
  };
  
  export default EducationCenter;