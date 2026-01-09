import { AppDataSource } from "../data-source";
import { TreeType, TreeRarity } from "../entities/TreeType";

export async function seedTreeTypes() {
  const treeRepository = AppDataSource.getRepository(TreeType);

  const count = await treeRepository.count();
  if (count > 0) return;

  const treeTypes = [
    {
      name: "pine",
      displayName: "Pine Tree",
      description: "A classic evergreen tree, perfect for beginners",
      rarity: TreeRarity.COMMON,
      unlockRequirement: 0,
      color: "#22c55e",
    },
    {
      name: "oak",
      displayName: "Oak Tree",
      description: "Strong and majestic, symbolizing wisdom",
      rarity: TreeRarity.COMMON,
      unlockRequirement: 5,
      color: "#16a34a",
    },
    {
      name: "sakura",
      displayName: "Cherry Blossom",
      description: "Delicate pink blossoms representing beauty",
      rarity: TreeRarity.UNCOMMON,
      unlockRequirement: 15,
      color: "#ec4899",
    },
    {
      name: "bamboo",
      displayName: "Bamboo",
      description: "Fast-growing and resilient",
      rarity: TreeRarity.UNCOMMON,
      unlockRequirement: 25,
      color: "#059669",
    },
    {
      name: "maple",
      displayName: "Maple Tree",
      description: "Beautiful autumn colors",
      rarity: TreeRarity.RARE,
      unlockRequirement: 50,
      color: "#dc2626",
    },
    {
      name: "willow",
      displayName: "Willow Tree",
      description: "Graceful and serene",
      rarity: TreeRarity.RARE,
      unlockRequirement: 75,
      color: "#65a30d",
    },
    {
      name: "bonsai",
      displayName: "Bonsai Tree",
      description: "Miniature masterpiece of patience",
      rarity: TreeRarity.EPIC,
      unlockRequirement: 100,
      color: "#0891b2",
    },
    {
      name: "ancient",
      displayName: "Ancient Tree",
      description: "Legendary tree of focus mastery",
      rarity: TreeRarity.LEGENDARY,
      unlockRequirement: 200,
      color: "#7c3aed",
    },
  ];

  await treeRepository.save(treeTypes);
  console.log("✅ Tree types seeded successfully");
}
