import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/keys";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get all rows
export const findDocuments = async (table, filters = []) => {
  let query = supabase.from(table).select("*");
  filters.forEach((f) => {
    query = query.eq(f.field, f.value);
  });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// Get one row by field
export const findOne = async (table, field, value) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(field, value)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

// Get two field match (for login)
export const findOneByTwo = async (table, field1, value1, field2, value2) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(field1, value1)
    .eq(field2, value2)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

// Insert a row
export const insertOne = async (table, data) => {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select();
  if (error) throw new Error(error.message);
  return result[0];
};

// Update a row by id
export const updateById = async (table, id, data) => {
  const { error } = await supabase
    .from(table)
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
};

// Delete a row by id
export const deleteById = async (table, id) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
};

// Search by text
export const searchDocuments = async (table, field, searchText) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .ilike(field, `%${searchText}%`);
  if (error) throw new Error(error.message);
  return data;
};

// Real time listener for live bus tracking
export const listenToTable = (table, callback) => {
  return supabase
    .channel(table)
    .on("postgres_changes",
      { event: "*", schema: "public", table },
      (payload) => callback(payload)
    )
    .subscribe();
};