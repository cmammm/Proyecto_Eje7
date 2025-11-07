


const { data, error } = await supabase
  .from('siguesTu').storage("fotos")
  .select("*")         