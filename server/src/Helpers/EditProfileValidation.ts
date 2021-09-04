export default function validateProfile(profileName: string, bio: string){
    if(profileName.length > 40) throw new Error("Profile name can't be longer than 40 characters");
    if(bio.length > 140) throw new Error("Description can't be longer than 140 characters");

    if(profileName.length === 0 || profileName === undefined) throw new Error("Profile name can't be empty");
    if(bio.length === 0 || bio === undefined) throw new Error("Profile description can't be empty");

    return
};