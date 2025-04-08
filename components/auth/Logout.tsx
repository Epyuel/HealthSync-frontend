import { useLogoutMutation } from "@/redux/api/commonApi";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import ErrorMessage from "../status/ErrorMessage";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function Logout() {
  const [logout, { isLoading, error }] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      localStorage.removeItem('role');
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {error && <ErrorMessage message="Failed to logout. Please try again." />}
      
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-fit mx-auto text-white bg-secondaryColor">
            Logout
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-gray-300 text-black hover:bg-gray-400">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleLogout} 
              isLoading={isLoading} 
              className="w-fit mx-auto text-white bg-secondaryColor"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
