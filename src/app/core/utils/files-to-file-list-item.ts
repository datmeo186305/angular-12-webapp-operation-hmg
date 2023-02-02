
/**
 * @params {File[]} files Array of files to add to the FileList
 * @return {FileList}
 */
const filesToFileListItem = (files) => {
  let b = new ClipboardEvent('').clipboardData || new DataTransfer();
  for (let i = 0, len = files.length; i < len; i++) b.items.add(files[i]);
  return b.files;
}

export default filesToFileListItem;
