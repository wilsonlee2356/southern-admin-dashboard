export function fileToBase64String(file: File | Blob) : Promise<string> {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file ? file : new Blob());
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
        // console.log("file result: ",fileReader.result as string);
        return fileReader.result as string;
    };
    return new Promise((resolve, reject) => {
        fileReader.onload = () => {
            resolve(fileReader.result as string);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}
