-- Step 1: Add city_id column as nullable
ALTER TABLE "Dish" ADD COLUMN "city_id" TEXT;

-- Step 2: Populate city_id from restaurant.city_id for existing dishes
UPDATE "Dish" d
SET "city_id" = r.city_id
FROM "Restaurant" r
WHERE d.restaurant_id = r.id;

-- Step 3: Make city_id required
ALTER TABLE "Dish" ALTER COLUMN "city_id" SET NOT NULL;

-- Step 4: Add foreign key constraint
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
