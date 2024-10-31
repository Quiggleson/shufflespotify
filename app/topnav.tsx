'use client';

export default function TopNav() {

    const basePath = process.env.NEXT_PUBLIC_ROOT_PATH;
    
    return (
        <div className="h-16 m-2 flex">
            <a href={basePath + "/"} className="outline rounded px-2 py-1 mx-2 h-fit">Home</a>
            <a href={basePath + "/login"} className="outline rounded px-2 py-1 mx-2 h-fit">Login</a>
        </div>
    );
}