import { Comment, CommentForm } from "./comment";
import { User, UserForm } from "./user";

export type FavoriteForm = {
    comment?: Comment;
    user?: User;
}
export type Favorite = FavoriteForm
