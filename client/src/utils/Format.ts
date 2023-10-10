import { format } from "date-fns";

export class FormatUtils {
	static urlPicture(pictureName: string) {
		return pictureName ? `http://localhost:9000/pictures/${pictureName}` : "http://localhost:9000/uploads/user.jpeg"
	}

	static formatDate(date: string | Date) {
		return format(new Date(date), "dd/MM/yyyy HH:mm:ss")
	}
}