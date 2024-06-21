for file in *.jpg *.JPG; do
  new_name=$(echo "$file" | sed -E 's/^[0-9]+\.//')
  mv "$file" "$new_name"
done