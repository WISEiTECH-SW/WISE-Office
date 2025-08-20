export default function UserProfile(props) {
    return (
    <div className="flex flex-col items-center">
        <img
        className="w-24 h-24 rounded-full bg-gray-300 object-cover"
        src={props.imageUrl ?? "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"}
        />
        <p className="mt-3 font-semibold">{props.name}</p>
    </div>
    );
}