import { AccordionItem } from "@/components/ui/accordion";
import { Accordion } from "@radix-ui/react-accordion";

export function LogsAccordion({ order }: { order: any }) {
    
    return(
        <Accordion type="multiple" className="mx-4">
            {logsArray.map((item: any) => (
                <AccordionItem value={ String(item.id) } key={ item.id }>
                    <div>{ item.orderId }</div>
                </AccordionItem>
            ))}
        </Accordion>
    );
}