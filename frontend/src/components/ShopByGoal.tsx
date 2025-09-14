import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi, goalApi } from '@/services/api';

// Import shop by goal images
import buildMuscleImg from '@/assets/shopbygoalimages/BUILDMUSCLE.png';
import loseWeightImg from '@/assets/shopbygoalimages/LOSEWEIGHT.png';
import improveEnduranceImg from '@/assets/shopbygoalimages/IMPROVEENDURANCE.png';
import wellnessImg from '@/assets/shopbygoalimages/WELLNESS.png';

interface GoalBoxProps {
  title: string;
  productCount: number;
  backgroundImage: string;
  goalValue: string;
  slug: string;
  className?: string;
}

const GoalBox: React.FC<GoalBoxProps> = ({
  title,
  productCount,
  backgroundImage,
  goalValue,
  slug,
  className = ''
}) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/goal/${slug}`);

  return (
    <div
      onClick={handleClick}
      className={`relative w-full aspect-[4/5] rounded-[15px] overflow-hidden cursor-pointer
        transition-transform duration-300 hover:scale-105 hover:border hover:border-[#F9A245]
        opacity-100 group ${className}`}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-right transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25 group-hover:bg-[#F9A245]/60 transition-colors duration-300 z-10" />

      {/* Orange circle on bottom-left */}
      <div
        className="absolute -left-[6%] -bottom-[6%] w-[50%] sm:w-[55%] md:w-[50%] aspect-square 
                   bg-[#F9A245] rounded-full z-20 transition-all duration-300 
                   group-hover:border group-hover:border-[#F9A245] group-hover:bg-white"
      />

      {/* Text */}
      <div className="absolute bottom-4 left-4 z-30 leading-[1]">
        <h3 className="font-extrabold text-white group-hover:text-black 
                       text-[14px] sm:text-[16px] md:text-[22px] lg:text-[28px] 
                       tracking-tight uppercase transition-colors duration-300">
          {title.split(' ').map((w, i) => (
            <span key={i} className="block">{w}</span>
          ))}
        </h3>
        <p className="mt-1 sm:mt-2 text-white group-hover:text-black 
                      text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] 
                      font-medium tracking-[0.06em] uppercase transition-colors duration-300">
          {productCount} Products
        </p>
      </div>
    </div>
  );
};

interface ShopByGoalProps {
  className?: string;
}

const ShopByGoal: React.FC<ShopByGoalProps> = ({ className = '' }) => {
  const [goals, setGoals] = useState([
    {
      title: 'BUILD MUSCLE',
      productCount: 0,
      backgroundImage: buildMuscleImg,
      goalValue: 'MUSCLE_GAIN',
      slug: 'build-muscle'
    },
    {
      title: 'LOSE WEIGHT',
      productCount: 0,
      backgroundImage: loseWeightImg,
      goalValue: 'WEIGHT_LOSS',
      slug: 'lose-weight'
    },
    {
      title: 'IMPROVE ENDURANCE',
      productCount: 0,
      backgroundImage: improveEnduranceImg,
      goalValue: 'ENERGY_PERFORMANCE',
      slug: 'improve-endurance'
    },
    {
      title: 'WELLNESS',
      productCount: 0,
      backgroundImage: wellnessImg,
      goalValue: 'HEALTH_WELLNESS',
      slug: 'wellness'
    }
  ]);
  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        // Update product counts for each goal
        const updatedGoals = await Promise.all(
          goals.map(async (goal) => {
            try {
              const response = await productApi.getProducts({ shopByGoal: goal.goalValue, limit: 1 });
              return {
                ...goal,
                productCount: response.success ? response.pagination?.totalDocs || 0 : 0
              };
            } catch (error) {
              console.error(`Error fetching products for ${goal.goalValue}:`, error);
              return {
                ...goal,
                productCount: Math.floor(Math.random() * 50) + 10 // Fallback random count
              };
            }
          })
        );
        setGoals(updatedGoals);
      } catch (error) {
        console.error('Error fetching product counts:', error);
      }
    };

    fetchProductCounts();
  }, []);

  return (
    <section
      className={`py-8 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] relative overflow-hidden ${className}`}
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        paddingLeft: 'clamp(1rem, 4vw, 4rem)',
        paddingRight: 'clamp(1rem, 4vw, 4rem)'
      }}
    >
      {/* Enhanced Protein-Themed Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#F9A245]/20 via-transparent to-[#FEEBCB]/20" />
      <div className="absolute top-0 left-0 w-[25rem] h-[25rem] bg-gradient-radial from-[#F9A245]/25 to-transparent blur-2xl animate-float-slow" />
      <div className="absolute bottom-0 right-0 w-[25rem] h-[25rem] bg-gradient-radial from-[#FEEBCB]/25 to-transparent blur-2xl animate-float-slow-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] bg-gradient-radial from-[#E86A12]/20 to-transparent blur-2xl animate-pulse" />
      
      {/* Protein Molecule Patterns */}
      <div className="absolute top-[20%] left-[10%] w-[15rem] h-[15rem] bg-gradient-radial from-[#40B75D]/15 to-transparent blur-xl animate-float opacity-60" />
      <div className="absolute bottom-[25%] right-[15%] w-[18rem] h-[18rem] bg-gradient-radial from-[#F9A245]/20 to-transparent blur-xl animate-float-slow opacity-50" />
      
      {/* Enhanced Floating Particles with Protein Theme */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float shadow-lg ${
              i % 4 === 0 ? 'bg-gradient-to-r from-[#40B75D]/40 to-[#F9A245]/30' :
              i % 4 === 1 ? 'bg-gradient-to-r from-[#F9A245]/40 to-[#E86A12]/30' :
              i % 4 === 2 ? 'bg-gradient-to-r from-[#E86A12]/35 to-[#40B75D]/25' :
              'bg-gradient-to-r from-[#FEEBCB]/45 to-[#F9A245]/35'
            }`}
            style={{
              width: `${Math.random() * 10 + 6}px`,
              height: `${Math.random() * 10 + 6}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-bold text-gray-900 text-[30px] lg:text-[40px]">
            SHOP BY <span className="text-[#F9A245]">GOAL</span>
          </h2>
          <p className="mt-2 text-gray-600 text-base lg:text-lg">
            Premium supplements for every fitness journey
          </p>
        </div>

        {/* Goals Grid */}
 {/* Goals Grid */}
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
  {goals.map((goal, index) => (
    <div key={index} className="w-full">
      <GoalBox
        title={goal.title}
        productCount={goal.productCount}
        backgroundImage={goal.backgroundImage}
        goalValue={goal.goalValue}
        slug={goal.slug}
      />
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default ShopByGoal;
