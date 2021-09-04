export default function validatePost(body: string){
    if (body === undefined || body === '') throw new Error("You post can't be empty");
    if (body.length > 140) throw new Error("You post can't have more than 140 characters");

    return
};