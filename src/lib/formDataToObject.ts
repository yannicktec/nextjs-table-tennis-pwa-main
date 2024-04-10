export const formDataToObject = (formData: FormData) => {
    const object: Record<string, any> = {};
    formData.forEach((value, key) => {

        object[key] = value;

    });
    return object;
};