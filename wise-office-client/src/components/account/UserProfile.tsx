export default function UserProfile(props) {
    return (
    <div className="flex flex-col items-center">
        <img
        className="w-24 h-24 rounded-full bg-gray-300 object-cover"
        src={props.imgUrl}
        alt="👤"
        />
        <p className="mt-3 font-semibold">{props.name}</p>
    </div>
    );
}