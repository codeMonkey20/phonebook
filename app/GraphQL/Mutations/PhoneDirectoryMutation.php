<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\PhoneDirectory;

final readonly class PhoneDirectoryMutation
{
    /** @param  array{}  $args */
    public function updateByPhoneNumber(null $_, array $args)
    {
        $phoneDirectory = PhoneDirectory::where('phone_number', $args['phone_number'])->first();
        
        if ($phoneDirectory == null) {
            return;
        }

        if (isset($args['new_phone_number'])) {
            $args['phone_number'] = $args['new_phone_number'];
            unset($args['new_phone_number']);
        } else {
            unset($args['phone_number']);
        }
        $phoneDirectory->update($args);
        $phoneDirectory = PhoneDirectory::find($phoneDirectory->id);
        $phoneDirectoryArray = $phoneDirectory->toArray();
        return $phoneDirectoryArray;
    }
}
