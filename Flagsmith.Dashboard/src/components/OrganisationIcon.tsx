import React from "react";
import {
  LuPickaxe,
  LuFactory,
  LuTrees,
  LuBuilding,
  LuHouse,
  LuBriefcase,
  LuGraduationCap,
  LuStethoscope,
  LuWallet,
  LuShoppingCart,
  LuWrench,
  LuServer,
  LuCircleHelp,
  LuLightbulb,
  LuHammer,
  LuWarehouse,
  LuTruck,
  LuTrainFront,
  LuWaves,
  LuShield,
  LuPlane,
  LuHandshake,
  LuSpeech,
  LuWheat,
  LuLandmark,
  LuPhone,
} from "react-icons/lu";

interface IconMapperProps {
  text: string;
  size?: number;
  color?: string;
  className?: string;
}

interface IconMapping {
  icon: React.ComponentType;
  keywords: string[];
}

const OrganisationIcon = ({
  text,
  size = 24,
  color = "currentColor",
  className = "",
}: IconMapperProps) => {
  const createIconMappings = (): IconMapping[] => [
    {
      icon: LuWheat,
      keywords: ["farm"],
    },
    {
      icon: LuWaves,
      keywords: [
        "water",
        "ocean",
        "lake",
        "river",
        "aqua",
        "hydro",
        "marine",
        "flood",
        "floodplain",
        "port",
        "irrigation",
        "wharf",
      ],
    },
    {
      icon: LuTrees,
      keywords: ["environment", "land"],
    },
    {
      icon: LuLandmark,
      keywords: ["council", "government", "city", "department"],
    },
    {
      icon: LuPickaxe,
      keywords: [
        "mining",
        "mineral",
        "resources",
        "ore",
        "coal",
        "metals",
        "exploration",
        "iron",
        "gold",
      ],
    },
    {
      icon: LuFactory,
      keywords: [
        "manufacturing",
        "factory",
        "industrial",
        "production",
        "processing",
        "plant",
      ],
    },
    {
      icon: LuTrees,
      keywords: ["forest", "timber", "wood", "lumber", "paper", "pulp"],
    },
    {
      icon: LuHouse,
      keywords: [
        "real estate",
        "property",
        "construction",
        "development",
        "builders",
        "realty",
        "home",
      ],
    },
    {
      icon: LuWallet,
      keywords: [
        "bank",
        "financial",
        "finance",
        "investment",
        "capital",
        "holdings",
        "asset",
      ],
    },
    {
      icon: LuBriefcase,
      keywords: [
        "consult",
        "consulting",
        "services",
        "business",
        "management",
        "solutions",
        "advisory",
      ],
    },
    {
      icon: LuGraduationCap,
      keywords: [
        "education",
        "school",
        "university",
        "college",
        "academy",
        "institute",
        "training",
      ],
    },
    {
      icon: LuStethoscope,
      keywords: [
        "health",
        "medical",
        "healthcare",
        "hospital",
        "clinic",
        "pharmaceutical",
      ],
    },
    {
      icon: LuWrench,
      keywords: [
        "engineering",
        "technical",
        "mechanics",
        "maintenance",
        "equipment",
      ],
    },
    {
      icon: LuServer,
      keywords: [
        "technology",
        "tech",
        "software",
        "digital",
        "systems",
        "computing",
        "data",
      ],
    },
    {
      icon: LuShield,
      keywords: ["defence", "RAAF", "military", "army"],
    },
    {
      icon: LuLightbulb,
      keywords: [
        "energy",
        "power",
        "electric",
        "utilities",
        "electricity",
        "arc",
      ],
    },
    {
      icon: LuHammer,
      keywords: ["construction", "builders", "contracting", "infrastructure"],
    },
    {
      icon: LuWarehouse,
      keywords: ["logistics", "storage", "warehouse", "distribution", "supply"],
    },
    {
      icon: LuBuilding,
      keywords: [
        "corporation",
        "group",
        "company",
        "enterprise",
        "organization",
      ],
    },
    {
      icon: LuTruck,
      keywords: ["transport", "freight", "trucking", "delivery", "shipping"],
    },
    {
      icon: LuTrainFront,
      keywords: ["railway", "rail", "railroad", "transit", "metro"],
    },
    {
      icon: LuPlane,
      keywords: ["airport", "terminal", "flying"],
    },
    {
      icon: LuHandshake,
      keywords: ["community"],
    },
    {
      icon: LuSpeech,
      keywords: ["engage"],
    },
    {
      icon: LuShoppingCart,
      keywords: [
        "retail",
        "commerce",
        "trading",
        "market",
        "store",
        "shop",
        "mart",
      ],
    },
    {
      icon: LuPhone,
      keywords: ["communication", "communications"],
    },
  ];

  const getIconComponent = (searchText: string): React.ReactNode => {
    const lowercaseText = searchText.toLowerCase();
    const iconMappings = createIconMappings();

    const matchingMapping = iconMappings.find((mapping) =>
      mapping.keywords.some((keyword) =>
        new RegExp(`\\b${keyword}\\b`).test(lowercaseText)
      )
    );

    const IconComponent = matchingMapping?.icon || LuCircleHelp;
    return <IconComponent size={size} color={color} className={className} />;
  };

  return getIconComponent(text);
};

export default OrganisationIcon;
