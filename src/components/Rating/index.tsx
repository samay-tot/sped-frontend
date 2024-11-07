import React from "react";

interface RatingStarsProps {
  rating: number;
}
const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const roundedRating = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        if (index < roundedRating) {
          return (
            <span key={index} className="text-xl mr-1 text-[#f69f1d]">
              ★
            </span>
          );
        } else if (index === roundedRating && hasHalfStar) {
          return (
            <span key={index} className="text-xl mr-1 text-[#f69f1d]">
              ★
            </span>
          );
        } else {
          return (
            <span key={index} className="text-xl mr-1 text-slate-300">
              ★
            </span>
          );
        }
      })}
    </div>
  );
};

export default RatingStars;
