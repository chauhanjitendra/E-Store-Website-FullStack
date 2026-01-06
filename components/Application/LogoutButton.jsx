import { AiOutlineLogout } from "react-icons/ai";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { catchError } from "@/lib/helperFunction";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "@/store/reducer/authReducer";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

const LogoutButton = () => {
    const dispatch = useDispatch()
    const router = useRouter()


    const handleLogout = async ()=>{
        try {
            const {data: logoutResponse} = await axios.post('/api/auth/logout')
            if(!logoutResponse.success){
                throw new Error(logoutResponse.message)
            }
            dispatch(logout())
            showToast('success', logoutResponse.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            catchError(error)
            showToast('error', error.message)
        }
    }
  return (
    <DropdownMenuItem onClick={handleLogout}>
      <button className="flex w-full items-center gap-2 cursor-pointer">
        <AiOutlineLogout />
        <span>Logout</span>
      </button>
    </DropdownMenuItem>
  );
};

export default LogoutButton;
