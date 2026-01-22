-- Make category_id required
ALTER TABLE "Dish" ALTER COLUMN "category_id" SET NOT NULL;

-- Make cuisine_id required
ALTER TABLE "Restaurant" ALTER COLUMN "cuisine_id" SET NOT NULL;

-- Drop old category column
ALTER TABLE "Dish" DROP COLUMN "category";

-- Drop old cuisine_type column
ALTER TABLE "Restaurant" DROP COLUMN "cuisine_type";
