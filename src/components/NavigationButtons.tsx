import Link from "next/link";
import { Button } from "./ui/button";

const links = [ 
    { href: "/about", label: "About"},
    { href: "/experience", label: "Experiences"},
    { href: "/contact", label: "Contact Me"}, 
    { href: "/donate", label: "Donations"},
]

export default function NavigationButtons() {
    return (
        <div className="grid grid-cols-2 gap-4 w-full">
            {links.map((link) => (
                <Link key={link.href} href={link.href}>
                    <Button variant="outline" className="px-6 py-6 w-full my-2">
                        
                    {link.label}
                    </Button>
                </Link>
            ))}
        </div>
    )
}