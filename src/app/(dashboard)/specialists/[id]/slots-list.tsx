"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Slot = {
    startsAt: Date;
    endsAt: Date;
    isBooked: boolean;
};

const INITIAL_VISIBLE = 6;

export function SlotsList({ slots }: { slots: Slot[] }) {
    const [showAll, setShowAll] = useState(false);
    const visibleSlots = showAll ? slots : slots.slice(0, INITIAL_VISIBLE);

    return (
        <>
            <motion.div
                layout
                className="grid gap-2 sm:grid-cols-2 md:grid-cols-3"
            >
                <AnimatePresence>
                    {visibleSlots.map((slot) => (
                        <motion.div
                            key={`${slot.startsAt.toISOString()}-${slot.endsAt.toISOString()}`}
                            layout
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-lg border px-3 py-2 text-sm"
                        >
                            {slot.startsAt.toLocaleString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}{" "}
                            –{" "}
                            {slot.endsAt.toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            {slot.isBooked && (
                                <span className="ml-2 text-muted-foreground">(booked)</span>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {slots.length > INITIAL_VISIBLE && (
                <div className="mt-4 flex justify-center">
                    <Button variant="outline" onClick={() => setShowAll((v) => !v)}>
                        {showAll ? "Show less" : "Show more"}
                    </Button>
                </div>
            )}
        </>
    );
}

