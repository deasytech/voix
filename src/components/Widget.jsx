import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { MessageCircle, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import tailwindStyles from "../index.css?inline";

export const Widget = ({ projectId }) => {
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const onSelectStar = (index) => {
    setRating(index + 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      userName: form.name.value,
      userEmail: form.email.value,
      message: form.feedback.value,
      projectId,
      rating,
    };
    setSubmitted(true);
    console.log(data);
    const res = await fetch(
      `${import.meta.env.VITE_ADMIN_API}/feedbacks/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      console.error("Error submitting feedback:", res.status);
      return;
    }
    const result = await res.json();
    console.log(result.data.id);
    // setSubmitted(false);
  };

  return (
    <>
      <style>{tailwindStyles}</style>
      <div className="widget fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="gap-2 rounded-full shadow-lg hover:scale-105">
              <MessageCircle className="h-5 w-5" /> Feedback
            </Button>
          </PopoverTrigger>
          <PopoverContent className="widget w-full rounded-lg bg-card p-4 shadow-lg max-w-md">
            <style>{tailwindStyles}</style>
            {submitted ? (
              <div>
                <h3 className="text-lg font-bold">
                  Thank you for your feedback!
                </h3>
                <p className="mt-4">
                  We appreciate your feedback. It helps us improve our product
                  and provide better service to our members.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold">Send us your feedback</h3>
                <form className="space-y-2" onSubmit={submit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        id="name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        id="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      placeholder="Tell us what you think"
                      id="feedback"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={cn(
                            "h-5 w-5 cursor-pointer",
                            rating > index
                              ? "fill-primary"
                              : "fill-muted stroke-muted-foreground"
                          )}
                          onClick={() => onSelectStar(index)}
                        />
                      ))}
                    </div>
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
