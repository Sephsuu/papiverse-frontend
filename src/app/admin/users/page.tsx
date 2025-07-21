import { Button } from "@/components/ui/button";

export default function UsersTable() {
    return(
        <section className="py-4 px-2">
            <div className="text-xl font-semibold">All Users</div>

            <div>
                <input
                    className="py-1 pl-3 rounded-md bg-light shadow-xs w-100"
                    placeholder="Search for a user"
                />
                <Button variant="secondary"></Button>
            </div>
        </section>
    )
}