<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\PhoneDirectory;

final readonly class PhoneDirectoryQuery
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        // TODO implement the resolver
        $result = PhoneDirectory::where('name', 'LIKE', "%" . $args['search_query'] . "%")
            ->orWhere('phone_number', 'LIKE', "%" . $args['search_query'] . "%")
            ->get();

        $result = $result->toArray();
        return $result;
    }
}
